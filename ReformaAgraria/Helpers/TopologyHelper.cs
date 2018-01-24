using GeoAPI.CoordinateSystems;
using GeoAPI.CoordinateSystems.Transformations;
using GeoAPI.Geometries;
using GeoJSON.Net.Geometry;
using Microsoft.AspNetCore.Http;
using NetTopologySuite.CoordinateSystems;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using NetTopologySuite.IO.Streams;
using ProjNet.Converters.WellKnownText;
using ProjNet.CoordinateSystems;
using ProjNet.CoordinateSystems.Transformations;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReformaAgraria.Helpers
{
    public static class TopologyHelper
    {       
        public static FeatureCollection GetFeatureCollection(ShapefileDataReader reader)
        {
            FeatureCollection features = new FeatureCollection();

            using (reader)
            {
                var header = reader.DbaseHeader;                
                while (reader.Read())
                {
                    var feature = new Feature();
                    var attributes = new AttributesTable();

                    for (var i = 0; i < header.NumFields; i++)
                        attributes.Add(header.Fields[i].Name, reader.GetValue(i));

                    feature.Geometry = reader.Geometry;
                    feature.Attributes = attributes;
                    features.Add(feature);
                }
            }

            return features;
        }

        public static FeatureCollection GetFeatureCollectionWgs84(string shapefilePath)
        {
            GeometryFactory geometryFactory = new GeometryFactory();
            var reader = new ShapefileDataReader(shapefilePath, geometryFactory);
            var features = GetFeatureCollection(reader);
            var projection = GetProjection(shapefilePath);
            features = TopologyHelper.TransformProjectionToWgs84(features, projection);
            return features;
        }

        public static FeatureCollection GetFeatureCollectionWgs84(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            using (var archive = new ZipArchive(stream))
            {
                var shapeEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".shp"));
                var indexEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".shx"));
                var dbfEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".dbf"));
                var projectionEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".prj"));
                var dataEncodingEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".cpg"));
                var spatialIndexEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".sbn"));
                var spatialIndexIndexEntry = archive.Entries.FirstOrDefault(e => e.Name.Contains(".sbx"));


                var shapeStream = new ZipStreamProvider(StreamTypes.Shape, shapeEntry);
                var indexStream = new ZipStreamProvider(StreamTypes.Index, indexEntry);
                var dataStream = new ZipStreamProvider(StreamTypes.Data, dbfEntry);
                IStreamProvider projectionStream = null;
                IStreamProvider dataEncodingStream = null;
                IStreamProvider spatialIndexStream = null;
                IStreamProvider spatialIndexIndexStream = null;

                if (projectionEntry != null)
                    projectionStream = new ZipStreamProvider(StreamTypes.Projection, projectionEntry);
                if (dataEncodingEntry != null)
                    dataEncodingStream = new ZipStreamProvider(StreamTypes.DataEncoding, dataEncodingEntry);
                if (spatialIndexEntry != null)
                    spatialIndexStream = new ZipStreamProvider(StreamTypes.SpatialIndex, spatialIndexEntry);
                if (spatialIndexIndexEntry != null)
                    spatialIndexIndexStream = new ZipStreamProvider(StreamTypes.SpatialIndexIndex, spatialIndexIndexEntry);

                var registry = new ShapefileStreamProviderRegistry(shapeStream, dataStream, indexStream,
                    true, true, true, dataEncodingStream, projectionStream, spatialIndexStream, spatialIndexIndexStream);

                var reader = new ShapefileDataReader(registry, new GeometryFactory());
                var features = GetFeatureCollection(reader);
                var projection = GetProjection(projectionEntry);
                features = TopologyHelper.TransformProjectionToWgs84(features, projection);
                return features;
            }
        }

        public static string GetGeojson(FeatureCollection features)
        {
            var serializer = GeoJsonSerializer.Create();
            var writer = new StringWriter();
            serializer.Serialize(writer, features);
            return writer.ToString();
        }

        public static ICoordinateSystem GetProjection(string shapeFilePath)
        {
            var projectionFilePath = Path.ChangeExtension(shapeFilePath, "prj");
            var projection = File.ReadAllText(projectionFilePath);
            var cfac = new CoordinateSystemFactory();
            return cfac.CreateFromWkt(projection);
        }   
        
        public static ICoordinateSystem GetProjection(ZipArchiveEntry projectionEntry)
        {
            using (var projectionStream = projectionEntry.Open())
            using (var stream = new StreamReader(projectionStream))
            {
                var projection = stream.ReadToEnd();
                var cfac = new CoordinateSystemFactory();
                return cfac.CreateFromWkt(projection);
            }
        }

        public static ICoordinateTransformation GetCoordinateTransformer(
            ICoordinateSystem source, ICoordinateSystem dest)
        {
            var ctfac = new CoordinateTransformationFactory();
            var cfac = new CoordinateSystemFactory();
            return ctfac.CreateFromCoordinateSystems(source, dest);
        }       

        public static FeatureCollection TransformProjectionToWgs84(
            FeatureCollection features, ICoordinateSystem source)
        {           
            var dest = GeographicCoordinateSystem.WGS84;
            var transformer = GetCoordinateTransformer(source, dest);

            features.CRS = new NamedCRS("urn:ogc:def:crs:OGC:1.3:CRS84");            
            foreach(var feature in features.Features)
            {
                var transformFilter = new CoordinateTransformationFilter(transformer);
                for (var i = 0; i < feature.Geometry.NumGeometries; i++)
                {
                    feature.Geometry.GetGeometryN(i).Apply(transformFilter);
                }
            }

            return features;
        }

        public static decimal GetArea(FeatureCollection features)
        {
            decimal area = 0;
            foreach (var feature in features.Features)
            {
                for (var i = 0; i < feature.Geometry.NumGeometries; i++)
                {
                    area += (decimal)feature.Geometry.GetGeometryN(i).Area;
                }
            }            
            return area;
        }        
    }

    public class CoordinateTransformationFilter : ICoordinateSequenceFilter
    {
        private readonly ICoordinateTransformation _transformation;

        public CoordinateTransformationFilter(ICoordinateTransformation transformation)
        {
            _transformation = transformation ??
                throw new ArgumentNullException($"{nameof(transformation)} can't be null.");
        }

        /// <summary>
        /// Yes, always true.
        /// </summary>
        public bool Done => true;

        /// <summary>
        /// Automatic call IGeometry.GeometryChanged() method after tranformation.
        /// </summary>
        public bool GeometryChanged => true;

        public void Filter(ICoordinateSequence seq, int i)
        {
            _transformation.MathTransform.Transform(seq);
        }
    }
}

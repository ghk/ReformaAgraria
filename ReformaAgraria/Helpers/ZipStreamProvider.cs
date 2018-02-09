using NetTopologySuite.IO.Streams;
using System.IO;
using System.IO.Compression;

namespace ReformaAgraria.Helpers
{
    public class ZipStreamProvider : IStreamProvider
    {
        public ZipStreamProvider(string kind, ZipArchiveEntry zipEntry, bool validateZip = false)
        {
            Kind = kind;
            ZipEntry = zipEntry;
        }

        public Stream OpenRead()
        {
            var stream = new MemoryStream();
            using (var zipStream = ZipEntry.Open())
            {
                zipStream.CopyTo(stream);
                stream.Position = 0;
                return stream;
            }
        }

        public Stream OpenWrite(bool truncate)
        {
            var stream = new MemoryStream();
            using (var zipStream = ZipEntry.Open())
            {
                zipStream.CopyTo(stream);
                stream.Position = 0;
                return stream;
            }
        }

        public bool UnderlyingStreamIsReadonly
        {
            get { return false; }
        }

        public string Kind
        {
            get; private set;
        }

        public ZipArchiveEntry ZipEntry
        {
            get; private set;
        }
    }
}
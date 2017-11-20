using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;

namespace MicrovacWebCore
{
    public class ReadOnlyController<TModel, TId>: ModelController<TModel, TId>
        where TModel: class, IModel<TId>, new() 
    {
        public ReadOnlyController(DbContext dbContext) : base(dbContext) { IdField = "Id"; }
        public string IdField { get; set; }

        protected List<Expression<Func<TModel, Object>>> SingleIncludes = 
            new List<Expression<Func<TModel,object>>>();

        protected List<Expression<Func<TModel, Object>>> ListIncludes = 
            new List<Expression<Func<TModel,object>>>();

        protected bool AllowGetAll = true;

        [HttpGet]
        public virtual IList<TModel> GetAll()
        {
            if (!AllowGetAll)
                throw new ApplicationException("GetAll is not allowed");
            IQueryable<TModel> exp = dbSet;
            
            foreach (var include in ListIncludes)
            {
                exp = exp.Include(include);
            }
            
            exp = ApplyQuery(exp);
            exp = ApplyPageAndSort(exp);
            return exp.ToList();
        }

        [HttpGet("/count")]
        public virtual long Count()
        {
            IQueryable<TModel> exp = dbSet;
            exp = ApplyQuery(exp);
            var result = exp.LongCount();
            return result;
        }

        [HttpGet("{id}")]
        public virtual TModel Get(TId id)
        {
            IQueryable<TModel> exp = null;
            
            if(typeof(TId) == typeof(String))
                exp = dbSet.Where(IdField + "=\"" + id +"\"");
            else
                exp = dbSet.Where(IdField + "=" + id);
            
            foreach (var include in SingleIncludes)
            {
                exp = exp.Include(include);
            }

            exp = ApplyQuery(exp);
            var result = exp.SingleOrDefault();
            return result;
        }

        protected virtual IQueryable<TModel> ApplyQuery(IQueryable<TModel> query)
        {
            return query;
        }

        protected virtual IQueryable<TModel> ApplyPageAndSort(IQueryable<TModel> query)
        {
            var pageBegin = GetQueryString<int>("page", 1);
            var pageLength = GetQueryString<int>("perPage", 0);
            var sortFields = GetQueryString<string>("sort", IdField);
            
            query = Sort(query, sortFields);
            query = Page(query, pageBegin, pageLength);
            return query;
        }

        protected virtual TResult GetQueryString<TResult>(String key, TResult defaultValue = default(TResult))
        {
            var results = GetQueryStrings<TResult>(key).ToList();
            if (results.Count == 0)
                return defaultValue;
            return results[0];
        }

        protected virtual IEnumerable<TResult> GetQueryStrings<TResult>(String key)
        {
            if (HttpContext != null)
            {
                if (HttpContext.Request.Query.ContainsKey(key))
                {
                    foreach (var match in HttpContext.Request.Query[key])
                    {
                        var type = typeof(TResult);
                        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                            type = type.GenericTypeArguments[0];

                        if (type.IsEnum)
                        {
                            yield return (TResult)Enum.ToObject(type, Convert.ToUInt64(match));
                        }

                        yield return (TResult)Convert.ChangeType(match, type);
                    }
                }
            }
        }

        //sortFields example: Id,-Name
        protected virtual IQueryable<TModel> Sort(IQueryable<TModel> query, string sortFields)
        {
            var sortFieldsArray = sortFields.Split(',');
            foreach(var sortField in sortFieldsArray)
            {
                var sortOrder = "ASC";
                var newSortField = sortField;
                if (sortField.StartsWith('-')) {
                    newSortField = sortField.Remove(0, 1);
                    sortOrder = "DESC";
                }
                query = query.OrderBy(newSortField.Trim() + " " + sortOrder.Trim());
            }
            return query;
        }

        protected virtual IQueryable<TModel> Page(IQueryable<TModel> query, int pageBegin, int pageLength)
        {
            if (pageBegin > 0)
                query = query.Skip((pageBegin - 1) * pageLength);
            if (pageLength > 0)
                query = query.Take(pageLength);
            return query;
        }

        protected void SingleInclude(params Expression<Func<TModel, Object>>[] includes)
        {
            foreach(var include in includes)
                SingleIncludes.Add(include);
        }

        protected void ListInclude(params Expression<Func<TModel, Object>>[] includes)
        {
            foreach(var include in includes)
                ListIncludes.Add(include);
        }

        protected void Include(params Expression<Func<TModel, Object>>[] includes)
        {
            foreach (var include in includes) { 
                SingleIncludes.Add(include);
                ListIncludes.Add(include);
            }
        }

    }
   
}

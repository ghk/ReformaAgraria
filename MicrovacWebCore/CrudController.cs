using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Net.Http;
using System.Reflection;

namespace MicrovacWebCore
{
    public class CrudController<TModel, TId> : ReadOnlyController<TModel, TId>
        where TModel : class, IModel<TId>, new()
    {

        protected List<Expression<Func<TModel, Object>>> PostFields =
            new List<Expression<Func<TModel, object>>>();

        protected List<Expression<Func<TModel, Object>>> PutFields =
            new List<Expression<Func<TModel, object>>>();

        public CrudController(DbContext dbContext) : base(dbContext) { }

        [HttpPost]
        public virtual TId Post([FromBody] TModel model)
        {
            if (PostFields.Count > 0)
            {
                var m = new TModel();
                foreach (var field in PostFields)
                    SetModelProperty(field, model, m);
                model = m;
            }

            PrePersist(HttpMethod.Post, model);
            dbSet.Add(model);
            dbContext.SaveChanges();
            PostPersist(HttpMethod.Post, model);
            return model.Id;
        }

        [HttpPut]
        public virtual TId Put([FromBody] TModel model)
        {
            if (PutFields.Count > 0)
            {
                var m = Get(model.Id);
                foreach (var field in PutFields)
                    SetModelProperty(field, model, m);
                model = m;
            }

            PrePersist(HttpMethod.Put, model);
            dbContext.Entry(model).State = EntityState.Modified;
            dbContext.SaveChanges();
            PostPersist(HttpMethod.Put, model);
            return model.Id;
        }

        [HttpDelete("{id}")]
        public virtual TId Delete(TId id)
        {
            var model = new TModel { Id = id };
            PrePersist(HttpMethod.Delete, model);
            dbContext.Entry(model).State = EntityState.Deleted;
            dbContext.SaveChanges();
            PostPersist(HttpMethod.Delete, model);
            return model.Id;
        }

        private void SetModelProperty(Expression<Func<TModel, Object>> memberLamda, TModel source, TModel target)
        {
            var memberSelectorExpression = memberLamda.Body as MemberExpression;
            if(memberSelectorExpression == null)
            {
                var convertExpression = memberLamda.Body as UnaryExpression;
                memberSelectorExpression = convertExpression.Operand as MemberExpression;
            }
            var property = memberSelectorExpression.Member as PropertyInfo;
            var val = property.GetValue(source);
            property.SetValue(target, property.GetValue(source), null);
        }
        
        protected virtual void PrePersist(HttpMethod method, TModel model) { }
        protected virtual void PostPersist(HttpMethod method, TModel model) { }
    }
      
}

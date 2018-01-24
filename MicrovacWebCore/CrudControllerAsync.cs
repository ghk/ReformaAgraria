using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace MicrovacWebCore
{
    public class CrudControllerAsync<TModel, TId> : ReadOnlyControllerAsync<TModel, TId>
        where TModel : class, IModel<TId>, new()
    {

        protected List<Expression<Func<TModel, Object>>> PostFields =
            new List<Expression<Func<TModel, object>>>();

        protected List<Expression<Func<TModel, Object>>> PutFields =
            new List<Expression<Func<TModel, object>>>();

        public CrudControllerAsync(DbContext dbContext) : base(dbContext) { }

        [HttpDelete("{id}")]
        public virtual async Task<TId> DeleteAsync(TId id)
        {
            var model = new TModel { Id = id };
            dbContext.Entry(model).State = EntityState.Deleted;
            await dbContext.SaveChangesAsync();
            return model.Id;
        }

        [HttpPost]
        public virtual async Task<TId> PostAsync([FromBody] TModel model)
        {
            if (PostFields.Count > 0)
            {
                var m = new TModel();
                foreach (var field in PostFields)
                    SetModelProperty(field, model, m);
                model = m;
            }

            PrePersist(model);
            dbSet.Add(model);
            await dbContext.SaveChangesAsync();
            PostPersist(model);
            return model.Id;
        }

        [HttpPut]
        public virtual async Task<TId> PutAsync([FromBody] TModel model)
        {
            if (PutFields.Count > 0)
            {
                var m = await GetAsync(model.Id);
                foreach (var field in PutFields)
                    SetModelProperty(field, model, m);
                model = m;
            }

            PrePersist(model);
            dbContext.Entry(model).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            PostPersist(model);
            return model.Id;
        }

        private void SetModelProperty(Expression<Func<TModel, Object>> memberLamda, TModel source, TModel target)
        {
            var memberSelectorExpression = memberLamda.Body as MemberExpression;
            if (memberSelectorExpression == null)
            {
                var convertExpression = memberLamda.Body as UnaryExpression;
                memberSelectorExpression = convertExpression.Operand as MemberExpression;
            }
            var property = memberSelectorExpression.Member as PropertyInfo;
            var val = property.GetValue(source);
            property.SetValue(target, property.GetValue(source), null);
        }

        protected virtual void PrePersist(TModel model) { }
        protected virtual void PostPersist(TModel model) { }
    }

}

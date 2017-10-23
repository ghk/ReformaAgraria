﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace MicrovacWebCore
{
    public class CrudController<TModel, TId>: ReadOnlyController<TModel, TId>
        where TModel: class, IModel<TId>, new()
    {

        protected List<Expression<Func<TModel, Object>>> PostFields =
            new List<Expression<Func<TModel, object>>>();

        protected List<Expression<Func<TModel, Object>>> PutFields =
            new List<Expression<Func<TModel, object>>>();

        public CrudController(DbContext dbContext): base(dbContext) { }

        public virtual void Delete(TId id)
        {
            var model = new TModel { Id = id };            
            dbContext.Entry(model).State = EntityState.Deleted;
            dbContext.SaveChanges();
        }

        public virtual TId Post([FromBody] TModel model)
        {
            if (PostFields != null)
            {
                var m = new TModel();
                foreach (var field in PostFields)
                    SetModelProperty(field, model, m);
                model = m;
            }

            PrePersist(model);
            dbSet.Add(model);
            dbContext.SaveChanges();
            PostPersist(model);
            return model.Id;
        }

        public virtual TId Put([FromBody] TModel model)
        {
            if (PutFields != null)
            {
                var m = Get(model.Id);
                foreach (var field in PutFields)
                    SetModelProperty(field, model, m);
                model = m;
            }

            PrePersist(model);
            dbContext.Entry(model).State = EntityState.Modified;
            dbContext.SaveChanges();
            PostPersist(model);
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
        
        protected virtual void PrePersist(TModel model) { }
        protected virtual void PostPersist(TModel model) { }
    }
      
}
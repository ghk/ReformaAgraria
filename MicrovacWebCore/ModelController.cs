using System;
using System.Linq.Expressions;
using System.Reflection;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace MicrovacWebCore
{    
    public class ModelController<TModel, TId> : ControllerBase
        where TModel : class, IModel<TId>, new()
    {
        protected DbContext dbContext;
        protected DbSet<TModel> dbSet;

        public ModelController(DbContext dbContext)
        {
            this.dbContext = dbContext;
            this.dbSet = dbContext.Set<TModel>();
        }

        public class Updator
        {
            DbContext dbContext;
            DbSet<TModel> dbSet;
            TModel model;
            public Updator(DbContext dbContext, DbSet<TModel> dbSet, TModel model)
            {
                this.dbContext = dbContext;
                this.dbSet = dbSet;
                this.model = model;
            }

            public Updator Set<TProperty>(Expression<Func<TModel, TProperty>> memberLamda, TProperty value)
            {
                var memberSelectorExpression = memberLamda.Body as MemberExpression;
                var property = memberSelectorExpression.Member as PropertyInfo;
                property.SetValue(model, value, null);

                dbContext.Entry<TModel>(model).Property(memberLamda).IsModified = true;

                return this;
            }
            public Updator  Set<TProperty>(Expression<Func<TModel, TProperty>> memberLamda)
            {
                dbContext.Entry<TModel>(model).Property(memberLamda).IsModified = true;
                return this;
            }

            public void Save()
            {
                dbContext.SaveChanges();
            }
        }

        protected Updator Update(TId id)
        {
            return Update(dbContext, id);
        }

        public static Updator Update(DbContext dbContext, TId id)
        {
            var model = new TModel();
            model.Id = id;
            dbContext.Set<TModel>().Attach(model);
            return new Updator(dbContext, dbContext.Set<TModel>(), model);
        }

        protected Updator Update(TModel model)
        {
            dbSet.Attach(model);
            return new Updator(dbContext, dbSet, model);
        }
    }
}

namespace MicrovacWebCore
{
    public interface IModel { }

    public interface IModel<TId> : IModel
    {
        TId Id { get; set; }
    }
}
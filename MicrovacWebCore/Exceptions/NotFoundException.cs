using System;

namespace MicrovacWebCore.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException() : base("The requested resource is not found")
        {
        }

        public NotFoundException(string message) : base(message)
        {
        }

        public NotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
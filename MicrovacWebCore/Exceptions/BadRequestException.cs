using System;

namespace MicrovacWebCore.Exceptions
{
    public class BadRequestException : Exception
    {
        public Object Errors { get; set; }

        public BadRequestException() : base("There is something wrong with the request")
        {
        }

        public BadRequestException(string message) : base(message)
        {
        }

        public BadRequestException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
using Microsoft.AspNetCore.Builder;

namespace MicrovacWebCore.Helpers
{
    public class CompressPipeline
    {
        public void Configure(IApplicationBuilder app)
        {
            app.UseResponseCompression();
        }
    }
}
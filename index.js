const http = require('http');
const debug = require('debug');


// Process command line arguments
// Default values.
const port = get_option_value("port") || 8080;
const input_url = get_option_value("input_url");
const output_url = get_option_value("output_url");

if (!(output_url && input_url)) {
  debug("server:server")("Requires input_url and output_url options in order to run");
  return 1;
}


// Here it is! Our sole source of application state: a single stored string.
var last_seen_ip = null;


const requestHandler = (request, response) => {
  switch (request.url) {

    case "/" + input_url:
      const this_ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
      last_seen_ip = this_ip;
      response.end();
    break;

    case "/" + output_url:
      response.end(last_seen_ip);
    break;

    case "/" + output_url + ".html":
      response.end(output_html(last_seen_ip));
    break;

    case "/" + output_url + ".json":
      response.end(output_json(last_seen_ip));
    break;

    default:
      response.statusCode = 404;
      response.end("route not found\n");
    break;

  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})







/*
██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗   ██╗
██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
██║   ██║   ██║   ██║██║     ██║   ██║    ╚████╔╝ 
██║   ██║   ██║   ██║██║     ██║   ██║     ╚██╔╝  
╚██████╔╝   ██║   ██║███████╗██║   ██║      ██║   
 ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝                                                  
*/







// Note: will not return falsy values such as "", FALSE, or null.
function get_option_value(option_name) {
  return process.argv.slice(2).reduce(function(state, current_flag) {
    // Cut off the -- from the option.
    var option_string = current_flag.slice(2);
  
    // Check if the option text matches an option that we expect.
    if (option_string.slice(0, option_name.length) == option_name) {
      // Capture all text after the option name.
      var the_value = option_string.slice(option_name.length + 1);
      return the_value;
    }
    // Truthy values will "bubble up" and clobber falsy values.
    return state ? state : null;
  }, null);
}

function output_html(string) {
  return (
    `<!doctype html>
    <head>
      <meta charset="utf-8">
      <title>Familiar Aura reporter</title>
    </head>

    <body>
      <h2>${string}</h2>
    </body>
    </html>
`
  );
}

function output_json(string) {
  return JSON.stringify({ last_seen_ip: string });
}
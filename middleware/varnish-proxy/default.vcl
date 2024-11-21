vcl 4.1;

backend default {
    .host = "kong";
    .port = "8000";
}

# HTTPS termination settings

sub vcl_recv {
    # Set X-Forwarded-Proto header
    if (!req.http.X-Forwarded-Proto) {
        set req.http.X-Forwarded-Proto = "https";
    }
}
vcl 4.1;

backend default {
    .host = "kong";
    .port = "8000";
}
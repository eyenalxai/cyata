variable "NOMAD_URL" {
  type = string
}

variable "CF_DNS_API_TOKEN" {
  type = string
}

job "traefik" {
  group "traefik-group" {
    network {
      mode = "host"

      port "http" {
        static = 80
      }

      port "http_secure" {
        static = 443
      }
    }

    service {
      name     = "traefik"
      provider = "nomad"
    }

    task "traefik-task" {
      driver = "docker"

      config {
        image = "traefik"
        ports = ["http", "http_secure"]
        volumes = ["/opt/letsencrypt:/letsencrypt"]
        args = [
          "--api.dashboard=false",
          "--api.insecure=true",
          "--entrypoints.web.address=:${NOMAD_PORT_http}",
          "--entrypoints.websecure.address=:${NOMAD_PORT_http_secure}",
          "--entrypoints.web.http.redirections.entrypoint.to=websecure",
          "--entrypoints.web.http.redirections.entrypoint.scheme=https",
          "--providers.nomad=true",
          "--providers.nomad.endpoint.address=${NOMAD_URL}",
          "--providers.nomad.exposedByDefault=false",
          "--accesslog=true",
          "--log.level=INFO",
          "--certificatesresolvers.myresolver.acme.dnschallenge=true",
          "--certificatesresolvers.myresolver.acme.dnschallenge.provider=cloudflare",
          "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
        ]
      }

      env {
        NOMAD_URL = var.NOMAD_URL
        CF_DNS_API_TOKEN = var.CF_DNS_API_TOKEN
      }

      identity {
        env         = true
        change_mode = "restart"
      }
    }
  }
}
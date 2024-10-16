variable "NOMAD_URL" {
  type = string
}

job "traefik" {
  group "traefik-group" {
    network {
      mode = "bridge"

      port "http" {
        static = 80
      }

      port "http_secure" {
        static = 443
      }

      port "admin" {
        static = 8080
      }
    }

    service {
      name = "traefik"
      provider = "nomad"
    }

    task "traefik-task" {
      driver = "docker"
      
      config {
        image = "traefik"
        ports = ["admin", "http", "http_secure"]
        volumes = ["/opt/letsencrypt:/letsencrypt"]
        args = [
          "--api.dashboard=false",
          "--api.insecure=true",
          "--entrypoints.web.address=:${NOMAD_PORT_http}",
          "--entrypoints.websecure.address=:${NOMAD_PORT_http_secure}",
          "--entrypoints.traefik.address=:${NOMAD_PORT_admin}",
          "--providers.nomad=true",
          "--providers.nomad.endpoint.address=${NOMAD_URL}",
          "--providers.nomad.exposedByDefault=false",
          "--accesslog=true",
          "--log.level=DEBUG"
        ]
      }

      env {
        NOMAD_URL = var.NOMAD_URL
      }

      identity {
        env           = true
        change_mode   = "restart"
      }
    }
  }
}
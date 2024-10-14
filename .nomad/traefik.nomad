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

      port "admin" {
        static = 8080
      }
    }

    service {
      name = "traefik-http"
      provider = "nomad"
      port = "http"
    }

    task "traefik-task" {
      driver = "docker"
      
      config {
        image = "traefik"
        ports = ["admin", "http"]
        args = [
          "--api.dashboard=false",
          "--api.insecure=true",
          "--entrypoints.web.address=:${NOMAD_PORT_http}",
          "--entrypoints.traefik.address=:${NOMAD_PORT_admin}",
          "--providers.nomad=true",
          "--providers.nomad.endpoint.address=${NOMAD_URL}",
          "--providers.nomad.exposedByDefault=false"
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
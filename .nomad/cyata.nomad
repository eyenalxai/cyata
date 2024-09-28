variable "DATABASE_URL" {
  type = string
}

variable "OPENAI_API_KEY" {
  type = string
}

variable "TURNSTILE_SECRET_KEY" {
  type = string
}

job "cyata" {
  datacenters = ["dc1"]

  type = "service"

  group "cyata-group" {
    count = 3

    network {
      port "frontend" {
        to = -1
      }
    }

    service {
      name = "cyata-frontend"
      provider = "nomad"
      port = "frontend"
      tags = [
        "frontend",
        "traefik.enable=true",
        "traefik.http.routers.cyata.rule=Host(`cyata.local`)",
        "traefik.http.services.cyata.loadbalancer.server.port=${NOMAD_PORT_frontend}"
      ]

      check {
        name     = "Frontend Health"
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "cyata-task" {
      driver = "docker"

      config {
        image      = "localhost:5000/cyata:local"
        force_pull = true
        ports = ["frontend"]
      }

      env {
        DATABASE_URL = var.DATABASE_URL
        OPENAI_API_KEY = var.OPENAI_API_KEY
        TURNSTILE_SECRET_KEY = var.TURNSTILE_SECRET_KEY
        PORT    = "${NOMAD_PORT_frontend}"
      }
    }
  }
}
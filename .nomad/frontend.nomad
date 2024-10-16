variable "POSTGRES_USER" {
  type = string
}

variable "POSTGRES_PASSWORD" {
  type = string
}

variable "POSTGRES_DATABASE" {
  type = string
}

variable "OPENAI_API_KEY" {
  type = string
}

variable "TURNSTILE_SECRET_KEY" {
  type = string
}

variable "CYATA_IMAGE" {
  type = string
}


job "frontend" {
  group "frontend-group" {
    count = 3

    network {
      mode = "bridge"

      port "frontend" {
        to = -1
      }
    }

    service {
      name = "frontend"
      provider = "nomad"
      port = "frontend"
      tags = [
        "frontend",
        "traefik.enable=true",
        "traefik.http.routers.cyata.rule=Host(`test-cyata.takx.xyz`)",
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
        image      = var.CYATA_IMAGE
        ports = ["frontend"]
      }

      env {
        OPENAI_API_KEY = var.OPENAI_API_KEY
        TURNSTILE_SECRET_KEY = var.TURNSTILE_SECRET_KEY
        PORT    = "${NOMAD_PORT_frontend}"
      }

      template {
        data = <<EOF
{{- range service "postgres" }}
DATABASE_URL=postgres://${var.POSTGRES_USER}:${var.POSTGRES_PASSWORD}@{{ .Address }}:{{ .Port }}/${var.POSTGRES_DATABASE}
{{- end }}
EOF
        destination = "secrets/env"
        env         = true
      }
    }
  }
}
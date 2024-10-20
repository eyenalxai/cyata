variable "CYATA_IMAGE" {
  type = string
}

variable "DOMAIN" {
  type = string
}


job "frontend" {
  group "frontend-group" {
    count = 3

    network {
      mode = "bridge"

      port "frontend" {
        to = -1
        host_network = "private"
      }
    }

    service {
      name = "frontend"
      provider = "nomad"
      port = "frontend"
      tags = [
        "frontend",
        "traefik.enable=true",
        "traefik.http.routers.http-echo.rule=Host(`${var.DOMAIN}`)",
        "traefik.http.routers.cyata.entrypoints=websecure",
        "traefik.http.routers.cyata.tls.certresolver=myresolver",
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
        PORT    = "${NOMAD_PORT_frontend}"
      }

      template {
        data = <<EOF
{{- with nomadVar "nomad/jobs/frontend" }}
OPENAI_API_KEY={{.openai_api_key}}
TURNSTILE_SECRET_KEY={{.turnstile_secret_key}}

{{- $user := .postgres_user -}}
{{- $password := .postgres_password -}}
{{- $database := .postgres_database -}}

{{- range nomadService "postgres" }}
DATABASE_URL=postgres://{{$user}}:{{$password}}@{{ .Address }}:{{ .Port }}/{{$database}}
{{- end }}
{{- end }}
EOF
        destination = "secrets/env"
        env         = true
      }
    }
  }
}
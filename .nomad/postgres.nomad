variable "DOMAIN" {
  type = string
}


job "postgres" {
  group "postgres-group" {
    network {
      mode = "bridge"

      port "database" {
        to = -1
        host_network = "private"
      }
    }

    service {
      name = "postgres"
      provider = "nomad"
      port = "database"
      tags = [
        "database",
        "traefik.enable=true",
        "traefik.tcp.routers.db.rule=HostSNI(`database.${var.DOMAIN}`)",
        "traefik.tcp.routers.db.tls=true",
        "traefik.tcp.routers.db.entrypoints=database",
        "traefik.tcp.routers.db.tls.certresolver=myresolver",
        "traefik.tcp.services.db.loadbalancer.server.port=${NOMAD_PORT_database}"
      ]
    }

    task "postgres-task" {
      driver = "docker"

      config {
        image = "docker.io/postgres"
        ports = ["database"]
        volumes = ["/opt/nomad/data/postgres:/var/lib/postgresql/data"]
      }

      env {
        PGPORT = "${NOMAD_PORT_database}"
      }

      template {
        data        = <<EOF
{{- with nomadVar "nomad/jobs/postgres" -}}
POSTGRES_PASSWORD = {{.postgres_password}}
POSTGRES_USER = {{.postgres_user}}
POSTGRES_DB = {{.postgres_database}}
{{- end -}}
EOF
        destination = "secrets/env"
        env         = true
      }
    }
  }
}

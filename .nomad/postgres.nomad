variable "POSTGRES_PASSWORD" {
  type = string
}

variable "POSTGRES_USER" {
  type = string
}

variable "POSTGRES_DB" {
  type = string
}

job "postgres" {
  group "postgres-group" {
    network {
      mode = "bridge"

      port "db" {
        static = 5432
      }
    }

    service {
      name = "cyata-postgres"
      port = "db"
      tags = ["database", "postgres"]

      connect {
        sidecar_service {}
      }
    }

    task "postgres-task" {
      driver = "docker"

      config {
        image = "docker.io/postgres"
        ports = ["db"]
        volumes = ["/opt/nomad/data/postgres:/var/lib/postgresql/data"]
      }

      env {
        POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
        POSTGRES_USER = var.POSTGRES_USER
        POSTGRES_DB = var.POSTGRES_DB
      }
    }
  }
}

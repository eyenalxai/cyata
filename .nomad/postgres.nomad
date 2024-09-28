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
      port "db" {
        static = 5432
      }
    }

    service {
      name = "cyata-postgres"
      port = "db"
      tags = ["database", "postgres"]

      check {
        name     = "Postgres Health"
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "postgres-task" {
      driver = "docker"

      config {
        image = "docker.io/postgres"
        ports = ["db"]
      }

      env {
        POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
        POSTGRES_USER = var.POSTGRES_USER
        POSTGRES_DB = var.POSTGRES_DB
      }
    }
  }
}

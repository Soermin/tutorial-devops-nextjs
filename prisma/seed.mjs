import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionString),
});

const categories = [
  {
    name: "IoT Systems",
    slug: "iot-systems",
    description:
      "Practical device integration, telemetry pipelines, and edge-to-cloud communication patterns.",
  },
  {
    name: "Cloud Computing",
    slug: "cloud-computing",
    description:
      "Application deployment, container delivery, and infrastructure-aware backend patterns.",
  },
  {
    name: "DevOps Pipeline",
    slug: "devops-pipeline",
    description:
      "Automation paths for testing, packaging, delivery, and release confidence.",
  },
  {
    name: "Monitoring",
    slug: "monitoring",
    description:
      "Metrics, dashboards, alerts, and operational visibility for running systems.",
  },
  {
    name: "Networking",
    slug: "networking",
    description:
      "Service routing, reverse proxy flows, and network fundamentals for deployed applications.",
  },
];

const tutorials = [
  {
    title: "Building an IoT Monitoring System with ESP32 and MQTT",
    slug: "building-an-iot-monitoring-system-with-esp32-and-mqtt",
    description:
      "Connect ESP32 devices to MQTT topics, collect sensor telemetry, and prepare the data flow for observability dashboards.",
    content: `This tutorial walks through a small IoT monitoring architecture that starts at the sensor layer and ends in a dashboard-ready pipeline. The focus is not only on reading temperature or status data from an ESP32, but also on organizing how the device publishes messages into a topic structure that is easy to operate later.

You will model a practical MQTT topic layout, decide what payload fields are needed for visualization, and think about how the device should behave when connectivity drops. By treating reliability as part of the tutorial, the project becomes closer to a real engineering environment than a one-page demo.

At the end of the walkthrough, you will have a clear blueprint for connecting embedded devices, moving telemetry into the backend, and preparing the next stage for storage, monitoring, or alerting integrations.`,
    level: "Intermediate",
    readTime: "12 min read",
    published: true,
    categorySlug: "iot-systems",
  },
  {
    title: "Deploying Next.js with Docker Compose and Nginx",
    slug: "deploying-nextjs-with-docker-compose-and-nginx",
    description:
      "Package a Next.js application into containers and expose it through a clean reverse proxy setup for staging delivery.",
    content: `This guide focuses on turning a local Next.js project into a deployment-friendly stack using Docker Compose and Nginx. Instead of stopping at a single application container, the tutorial explains how to think about service boundaries, reverse proxy responsibilities, and reproducible environment setup.

You will see how container orchestration helps standardize the runtime, while Nginx handles upstream routing and client traffic in a way that mirrors common staging or small production environments. The goal is to keep the deployment readable for learners without hiding the operational pieces.

By the end, you will understand how application code, infrastructure configuration, and HTTP routing work together when preparing a web platform for a real server.`,
    level: "Intermediate",
    readTime: "10 min read",
    published: true,
    categorySlug: "cloud-computing",
  },
  {
    title: "Creating CI/CD Pipeline with Jenkins",
    slug: "creating-ci-cd-pipeline-with-jenkins",
    description:
      "Build an automation pipeline that validates changes, packages releases, and supports repeatable deployments.",
    content: `This tutorial introduces a practical Jenkins pipeline for application delivery. The main objective is to show how code moves from repository updates into automated build steps, quality checks, and deployment preparation without relying on abstract diagrams alone.

You will structure stages for dependency installation, testing, build validation, and deployment hooks while keeping the pipeline understandable for early-stage engineers. Each stage is treated as part of a reliable workflow rather than as a disconnected command.

After completing the tutorial, you will have a strong foundation for connecting repository events to CI/CD automation and expanding the pipeline into more advanced release strategies later.`,
    level: "Beginner",
    readTime: "9 min read",
    published: true,
    categorySlug: "devops-pipeline",
  },
  {
    title: "Monitoring Containers with Grafana and Prometheus",
    slug: "monitoring-containers-with-grafana-and-prometheus",
    description:
      "Collect service metrics from containerized workloads and build dashboards that help diagnose runtime issues.",
    content: `This walkthrough covers the observability side of a container-based platform. Instead of treating monitoring as an optional add-on, the tutorial shows how Prometheus and Grafana support day-to-day engineering decisions by making service behavior visible.

You will define a basic metrics collection path, connect those measurements to dashboards, and think about which operational signals actually help during debugging. The tutorial is designed to make monitoring approachable while still keeping it grounded in real runtime concerns.

When finished, you will have a monitoring baseline that can grow into alerting, capacity tracking, and deeper troubleshooting across multiple services.`,
    level: "Intermediate",
    readTime: "11 min read",
    published: true,
    categorySlug: "monitoring",
  },
];

function paragraphsToContentBlocks(content) {
  return JSON.stringify(
    content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph, index) => ({
        id: `seed-block-${index + 1}`,
        type: "paragraph",
        text: paragraph,
        meta: "",
      })),
  );
}

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }

  const categoryLookup = new Map(
    (
      await prisma.category.findMany({
        select: {
          id: true,
          slug: true,
        },
      })
    ).map((category) => [category.slug, category.id]),
  );

  for (const tutorial of tutorials) {
    const categoryId = categoryLookup.get(tutorial.categorySlug);

    if (!categoryId) {
      throw new Error(`Category not found for slug: ${tutorial.categorySlug}`);
    }

    const tutorialData = {
      title: tutorial.title,
      slug: tutorial.slug,
      description: tutorial.description,
      content: tutorial.content,
      contentBlocks: paragraphsToContentBlocks(tutorial.content),
      coverImageUrl: null,
      level: tutorial.level,
      readTime: tutorial.readTime,
      published: tutorial.published,
    };

    await prisma.tutorial.upsert({
      where: {
        slug: tutorial.slug,
      },
      update: {
        ...tutorialData,
        categoryId,
      },
      create: {
        ...tutorialData,
        categoryId,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

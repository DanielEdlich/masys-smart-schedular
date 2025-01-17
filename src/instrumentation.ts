export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { Profiler } = await import("@oaklean/profiler");

    const profiler = new Profiler();
    profiler.start("next-dev");

    // after 30 seconds, stop the profiler
    setTimeout(() => {
      profiler.finish("next-dev");
    }, 30000);
  }
}

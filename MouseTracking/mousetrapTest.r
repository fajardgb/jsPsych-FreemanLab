library(mousetrap)
library(ggplot2)

raw_data <- read.csv("MouseTracking/output/long_data.csv")
mt_data <- mt_import_long(raw_data)
mt_data <- mt_align_start(mt_data)
mt_data <- mt_remap_symmetric(mt_data,
  remap_xpos="no", remap_ypos="up")

mt_plot(mt_data, use = "trajectories")
ggsave("MouseTracking/output/plot.png")
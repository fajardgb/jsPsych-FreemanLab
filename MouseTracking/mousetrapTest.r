library(mousetrap)
library(ggplot2)

file_path <- "MouseTracking/output/sample_data_slow.csv"
dir <- dirname(file_path)
file_name <- tools::file_path_sans_ext(basename(file_path))
clean_file_path <- file.path(dir, paste0(file_name, "_clean.csv"))

# Clean data
print("Cleaning data")
source("MouseTracking/cleanup.r")

# Mousetrap functions
raw_data <- read.csv(clean_file_path)
mt_data <- mt_import_long(raw_data)
mt_data <- mt_align_start(mt_data)
mt_data <- mt_remap_symmetric(mt_data,
  remap_xpos="no", remap_ypos="up")

mt_plot(mt_data, use = "trajectories")
ggsave(file.path(dir, paste0(file_name, "_plot.png")))
print("Plot saved")
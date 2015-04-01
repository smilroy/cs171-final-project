##Set working directory
setwd("/Users/shannonmilroy/Documents/Harvard School Files/Spring 2015/Visualization/cs171-final-project/data/")

##Load data
data <- read.csv("IHME_GBD_2013_MDG6_1990_2013_HIV_TB_INCIDENCE_PREVALENCE_DEATHS_Y2014M11D21.CSV")

##Subset to HIV/AIDS
data <- subset(data, cause_name=="HIV/AIDS", select = c(location_name, year, age_group_name, sex_name, cause_name, metric, mean, lower, upper))

##Write to csv
write.csv(data, "HIVAIDS_data_clean")

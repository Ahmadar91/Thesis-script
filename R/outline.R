install.packages("outliers")
library(readxl)
#install.packages("xlsx")
#library(xlsx)
#install.packages(c("readxl","writexl")) 
library("outliers")
#install.packages(c("readxl","writexl")) 
library(writexl)
#install.packages("openxlsx") 
#library(openxlsx)


dataset <- read_excel("C:/Users/ahmad/Desktop/Exel/test.xlsx")
View(dataset)
final_table_dataset <- c()

### LOC
LOC <- dataset$LOC
pdf("C:/Users/ahmad/Desktop/Exel/test_loc.pdf")
boxplot(LOC, data=dataset, main="LOC")
dev.off()
fivenum(LOC)
quantile(LOC)
boxplot.stats(LOC)
lower_threshold <- boxplot.stats(LOC)$stats[1]
lower_threshold
upper_threshold <- boxplot.stats(LOC)$stats[5]
upper_threshold

threshold_flag <- c()

for (value in LOC) {
  if (value < lower_threshold)
    threshold_flag <- c(threshold_flag, "Min Outlier")
  else if (value > upper_threshold)
    threshold_flag <- c(threshold_flag, "Max Outlier")
  else
    threshold_flag <- c(threshold_flag, "Normal")
}

final_table_dataset <- cbind("LOC"=dataset$LOC,"LOCTeshHold"=threshold_flag)
# final_table_dataset <- cbind("LOC"=dataset$`LOC`,"LOCTeshHold"=threshold_flag, "ClassChanges"=dataset$ClassChanges, "CodeChurn"=dataset$CodeChurn,"NumberOfBugs"=dataset$NumberOfBugs,"DefectDensity"=dataset$DefectDensity)

### CC

cc <- dataset$`NumberOfClassChanges`
pdf("C:/Users/ahmad/Desktop/Exel/test_CC.pdf")
boxplot(cc, data=dataset, main="# Class Changes")
dev.off()

quantile(cc)
lower_threshold <- boxplot.stats(cc)$stats[1]
lower_threshold
upper_threshold <- boxplot.stats(cc)$stats[5]
upper_threshold

threshold_flag <- c()

for (value in cc) {
  if (value < lower_threshold)
    threshold_flag <- c(threshold_flag, "Min Outlier")
  else if (value > upper_threshold)
    threshold_flag <- c(threshold_flag, "Max Outlier")
  else
    threshold_flag <- c(threshold_flag, "Normal")
}

final_table_dataset <- cbind(final_table_dataset,"NumberOfClassChanges"=dataset$`NumberOfClassChanges`,"CCTeshHold"=threshold_flag )


### CChurn

CChurn <- dataset$`CodeChurn`
pdf("C:/Users/ahmad/Desktop/Exel/test_code churn.pdf")
boxplot(CChurn, data=dataset, main="Code Churn")
dev.off()

quantile(CChurn)
lower_threshold <- boxplot.stats(CChurn)$stats[1]
lower_threshold
upper_threshold <- boxplot.stats(CChurn)$stats[5]
upper_threshold

threshold_flag <- c()

for (value in CChurn) {
  if (value < lower_threshold)
    threshold_flag <- c(threshold_flag, "Min Outlier")
  else if (value > upper_threshold)
    threshold_flag <- c(threshold_flag, "Max Outlier")
  else
    threshold_flag <- c(threshold_flag, "Normal")
}

final_table_dataset <- cbind(final_table_dataset,"CodeChurn"=dataset$`CodeChurn`,"CChurnTeshHold"=threshold_flag )


### NumberOfBugs

NOB <- dataset$`NumberOfBugs`
pdf("C:/Users/ahmad/Desktop/Exel/test_#bugs.pdf")
boxplot(NOB, data=dataset, main="# Bugs")
dev.off()

quantile(NOB)
lower_threshold <- boxplot.stats(NOB)$stats[1]
lower_threshold
upper_threshold <- boxplot.stats(NOB)$stats[5]
upper_threshold

threshold_flag <- c()

for (value in NOB) {
  if (value < lower_threshold)
    threshold_flag <- c(threshold_flag, "Min Outlier")
  else if (value > upper_threshold)
    threshold_flag <- c(threshold_flag, "Max Outlier")
  else
    threshold_flag <- c(threshold_flag, "Normal")
}

final_table_dataset <- cbind(final_table_dataset,"NumberOfBugs"=dataset$`NumberOfBugs`,"NOBhurnTeshHold"=threshold_flag )


### DefectDensity

DD <- dataset$`DefectDensity`
pdf("C:/Users/ahmad/Desktop/Exel/test_DD.pdf")
boxplot(DD, data=dataset, main="Defect Density")
dev.off()

quantile(DD)
lower_threshold <- boxplot.stats(DD)$stats[1]
lower_threshold
upper_threshold <- boxplot.stats(DD)$stats[5]
upper_threshold

threshold_flag <- c()

for (value in DD) {
  if (value < lower_threshold)
    threshold_flag <- c(threshold_flag, "Min Outlier")
  else if (value > upper_threshold)
    threshold_flag <- c(threshold_flag, "Max Outlier")
  else
    threshold_flag <- c(threshold_flag, "Normal")
}

final_table_dataset <- cbind(final_table_dataset,"DefectDensity"=dataset$`DefectDensity`,"DDTeshHold"=threshold_flag )


#write.xlsx(final_table_dataset, "C:/Users/ahmad/Desktop/Exel/mydata.xlsx", asTable = FALSE)

data <- data.frame(final_table_dataset)
View(data)
#write_xlsx(data,"./data/simpleExcel.xlsx")
#write.xlsx(final_table_dataset,"C:/Users/ahmad/Desktop/Exel/mydata.xlsx")

#write.xlsx(data, "../mydata.xlsx", sheetName = "Sheet1", col.names = TRUE, row.names = TRUE)
write_xlsx(data,"C:/Users/ahmad/Desktop/Exel/mydata.xlsx")      


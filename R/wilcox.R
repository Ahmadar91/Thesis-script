
install.packages("dplyr")
install.packages("ggpubr")
install.packages("rstatix")
library(dplyr)
library(readxl)
library(writexl)
library("ggpubr")



dataset <- read_excel("C:/Users/ahmad/Desktop/Exel/test.xlsx")
View(dataset)

boxplot(dataset$NumberOfBugs ~ dataset$NumberOfChangesThreshold)
pdf("C:/Users/ahmad/Desktop/Exel/test_RQ1.1.pdf")
ggboxplot(dataset, x = "NumberOfChangesThreshold", y = "NumberOfBugs", 
color = "NumberOfChangesThreshold", palette = c("#00AFBB", "#E7B800"),
 ylab = "Number Of Bugs", xlab = "TeshHold")
dev.off()



boxplot(dataset$NumberOfClassChanges ~ dataset$NOBhurnTeshHold)
ggboxplot(dataset, x = "NOBhurnTeshHold", y = "NumberOfClassChanges", 
 color = "NOBhurnTeshHold", palette = c("#00AFBB", "#E7B800"),
  ylab = "Number Of Class Changes", xlab = "Tesh Hold")
boxplot(dataset$NumberOfBugs ~ dataset$LOCTeshHold)
ggboxplot(dataset, x = "LOCTeshHold", y = "NumberOfBugs", 
  color = "LOCTeshHold", palette = c("#00AFBB", "#E7B800"),
   ylab = "Number Of Bugss", xlab = "Tesh Hold")
boxplot(dataset$LOC ~ dataset$NOBhurnTeshHold)
ggboxplot(dataset, x = "NOBhurnTeshHold", y = "LOC", 
    color = "NOBhurnTeshHold", palette = c("#00AFBB", "#E7B800"),
     ylab = "LOC", xlab = "Tesh Hold")
boxplot(dataset$NumberOfClassChanges ~ dataset$LOCTeshHold)
ggboxplot(dataset, x = "LOCTeshHold", y = "NumberOfClassChanges", 
      color = "LOCTeshHold", palette = c("#00AFBB", "#E7B800"),
       ylab = "Number Of Class Changes", xlab = "Tesh Hold")
boxplot(dataset$LOC ~ dataset$CCTeshHold)
ggboxplot(dataset, x = "CCTeshHold", y = "LOC", 
         color = "CCTeshHold", palette = c("#00AFBB", "#E7B800"),
        ylab = "LOC", xlab = "Tesh Hold")



group_by(dataset, dataset$CCTeshHold) %>%
 summarise(
  count = n(),
 median = median(dataset$NumberOfBugs, na.rm = TRUE),
IQR = IQR(dataset$NumberOfBugs, na.rm = TRUE)
)
dataset %>% wilcox_test(NumberOfBugs ~ CCTeshHold, comparisons = list(c("Max Outlier", "Others(min and  normal)")), alternative = "greater")

res <- wilcox.test(dataset$NumberOfBugs ~ dataset$CCTeshHold, data = dataset,
 exact = FALSE)
res
res$p.value

#RQ1: Is there a relation between change-proneness and fault-proneness for classes in object-oriented systems?
#RQ1.1: Are highly change-prone classes also more fault-prone?
dataset %>% wilcox_test(NumberOfBugs ~ NumberOfChangesThreshold)
#Defect Density
dataset %>% wilcox_test(DefectDensity ~ NumberOfChangesThreshold)
#RQ1.2: Are highly fault-prone classes also more change-prone?
dataset %>% wilcox_test(NumberOfChanges ~ NumberOfBugsThreshold)
#Code Churn
dataset %>% wilcox_test(CodeChurn ~ NumberOfBugsThreshold)

#RQ2: Is there a relation between size and fault-proneness for classes in object-oriented systems?
#RQ2.1: Are larger classes also more fault-prone?
dataset %>% wilcox_test(NumberOfBugs ~ LOCThreshold)
#Defect Density
dataset %>% wilcox_test(DefectDensity ~ LOCThreshold)
#RQ2.2: Are highly fault-prone classes are usually the larger classes?
dataset %>% wilcox_test(LOC ~ NumberOfBugsThreshold)

#RQ3: Is there a relation between size and change-proneness for classes in object-oriented systems?
#RQ3.1: Are larger classes also more change-prone?
dataset %>% wilcox_test(NumberOfChanges ~ LOCThreshold)
#code Chrun
dataset %>% wilcox_test(CodeChurn ~ LOCThreshold)
#RQ3.2: Are highly change-prone classes are usually the larger classes?
dataset %>% wilcox_test(LOC ~ NumberOfChangesThreshold)











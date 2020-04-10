
const str = '[JENKINS-42717] - Prevent NPE when a non-existent Default View is specified in the global config (#2815) + [JENKINS-42717] - Document view management methods in Jenkins and ViewGroupMixIn +  [JKENKINS-42717] - GlobalDefauldViewConfiguration should not fail with NPE when the view is missing|+ [JENKINS-42717] - Draft the direct unit test + [JENKINS-42717] - Fix the tes implementatio + [JENKINS-42717] - Make FormException localizable [JENKINS-42717] - Fix te build glitch (cherry picked from commit 4074818b97d50b98b754f723842f03306a1ddaea)'
const sub = str.match(/JENKINS-[0-9]{1,6}|#[0-9]{1,6}|HUDSON-[0-9]{1,6}/gim)
console.log(sub)
for (let i = 0; i < sub.length; i++) {
  if (sub[i].startsWith('JEN')) {
    console.log(sub[i].substring(8, sub[i].length))
  } else {
    console.log(sub[i].substring(1, sub[i].length))
  }
}

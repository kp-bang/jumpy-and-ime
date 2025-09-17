import hscopesControlRun from "./hscopes"
import jumpyControlRun from "./jumpy"

const controlCenterRun = () => {
  jumpyControlRun()

  hscopesControlRun()
}

export default controlCenterRun

import { PersistableRESTTabState } from "@hoppscotch/common/helpers/rest/tab"
import { HoppUser } from "@hoppscotch/common/platform/auth"
import { TabStatePlatformDef } from "@hoppscotch/common/platform/tab"
import { def as platformAuth } from "@platform/auth"
import { getCurrentRestSession, updateUserSession } from "./tabState.api"
import { SessionType } from "../../api/generated/graphql"
import * as E from "fp-ts/Either"

async function writeCurrentTabState(
  _: HoppUser,
  persistableTabState: PersistableRESTTabState
) {
  await updateUserSession(JSON.stringify(persistableTabState), SessionType.Rest)
}

async function loadTabStateFromSync(): Promise<PersistableRESTTabState | null> {
  const currentUser = platformAuth.getCurrentUser()

  if (!currentUser)
    throw new Error("Cannot load request from sync without login")

  const res = await getCurrentRestSession()
  console.log(res)

  if (E.isRight(res)) {
    const currentRESTSession = res.right.me.currentRESTSession

    return currentRESTSession ? JSON.parse(currentRESTSession) : null
  } else {
  }

  return null
}

export const def: TabStatePlatformDef = {
  loadTabStateFromSync,
  writeCurrentTabState,
}

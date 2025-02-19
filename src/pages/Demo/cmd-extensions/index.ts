import { TestAsyncCommand, NsTestCmd } from './cmd-async-test'
import { DeployDagCommand, NsDeployDagCmd } from './cmd-deploy'
import { RenameNodeCommand, NsRenameNodeCmd } from './cmd-rename-node-modal'
import type { ICommandContributionConfig } from '@antv/xflow'
import { NsImportModuleCmd,ImportModuleCommand } from './cmd-import-modal'
import { NsUploadGradeCmd, UploadGradeCommand } from './cmd-upload-grade-modal'
/** 注册成为可以执行的命令 */

export const commandContributions: ICommandContributionConfig[] = [
  {
    ...NsTestCmd,
    CommandHandler: TestAsyncCommand,
  },
  {
    ...NsDeployDagCmd,
    CommandHandler: DeployDagCommand,
  },
  {
    ...NsRenameNodeCmd,
    CommandHandler: RenameNodeCommand,
  },
  {
    ...NsImportModuleCmd,
    CommandHandler:ImportModuleCommand,
  },
  {
    ...NsUploadGradeCmd,
    CommandHandler:UploadGradeCommand
  }
]

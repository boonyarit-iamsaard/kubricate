import type { CommandModule } from 'yargs';
import { SecretCommand, type SecretCommandOptions } from '../../commands/SecretCommand.js';
import { KubectlExecutor } from '../../executor/kubectl-executor.js';
import { ExecaExecutor } from '../../executor/execa-executor.js';
import type { GlobalConfigOptions } from '../../internal/types.js';
import { ConsoleLogger } from '../../internal/logger.js';
import { handlerError } from '../../internal/error.js';
import { ConfigLoader } from '../../commands/ConfigLoader.js';

export const secretValidateCommand: CommandModule<GlobalConfigOptions, SecretCommandOptions> = {
  command: 'validate',
  describe: 'Validate secret manager configuration',
  handler: async argv => {
    const logger = argv.logger ?? new ConsoleLogger();
    try {
      const executor = new KubectlExecutor('kubectl', logger, new ExecaExecutor());

      const configLoader = new ConfigLoader(argv, logger);
      const { orchestrator } = await configLoader.initialize({
        subject: 'secret validate',
        commandOptions: argv,
      });

      await new SecretCommand(argv, logger, executor).validate(orchestrator);
    } catch (error) {
      handlerError(error, logger);
    }
  },
};

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatTables1680000000001 implements MigrationInterface {
  name = "CreateChatTables1680000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`chat_conversations\` (
        \`id\` varchar(36) NOT NULL,
        \`userId\` varchar(36) NOT NULL,
        \`title\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        KEY \`FK_CHAT_CONV_USER\` (\`userId\`),
        CONSTRAINT \`FK_CHAT_CONV_USER\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await queryRunner.query(`
      CREATE TABLE \`chat_messages\` (
        \`id\` varchar(36) NOT NULL,
        \`conversationId\` varchar(36) NOT NULL,
        \`role\` enum('user', 'assistant') NOT NULL,
        \`content\` text NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        KEY \`FK_CHAT_MSG_CONV\` (\`conversationId\`),
        CONSTRAINT \`FK_CHAT_MSG_CONV\` FOREIGN KEY (\`conversationId\`) REFERENCES \`chat_conversations\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chat_messages\``);
    await queryRunner.query(`DROP TABLE \`chat_conversations\``);
  }
}

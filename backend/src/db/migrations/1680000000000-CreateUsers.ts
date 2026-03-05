import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1680000000000 implements MigrationInterface {
  name = 'CreateUsers1680000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`roles\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_USERS_EMAIL\` ON \`users\` (\`email\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_USERS_EMAIL\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}

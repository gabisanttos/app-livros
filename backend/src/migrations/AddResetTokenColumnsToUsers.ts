import { MigrationInterface, QueryRunner } from "typeorm"; 

 export class AddResetTokenColumnsToUsers1696000000000 implements MigrationInterface { 
     name = 'AddResetTokenColumnsToUsers1696000000000' 

     public async up(queryRunner: QueryRunner): Promise<void> { 
         // AÇÃO: Adiciona as colunas "resetToken" e "resetTokenExpiry" à tabela existente
         await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "resetToken" text`); 
         await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "resetTokenExpiry" TIMESTAMP`); 
     } 

     public async down(queryRunner: QueryRunner): Promise<void> { 
         // REVERSÃO: Remove as colunas
         await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetToken"`); 
         await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetTokenExpiry"`); 
     } 
 } 
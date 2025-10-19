import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({type:'text'})
    name!: string;

    @Column({type:'text', unique: true })
    email!: string;

    @Column({type:'text'})
    password: string;

    @Column({type:'text', nullable: true })
    resetToken: string | null;

    @Column({type:'timestamp', nullable: true })
    resetTokenExpiry: Date | null;
}
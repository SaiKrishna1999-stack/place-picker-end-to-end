import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, OneToMany, OneToOne } from 'typeorm';
import { PlaceEntity } from './places-entity';

@Entity('images')
export class ImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  src!: string;

  @Column()
  alt!: string;

  @OneToOne(() => PlaceEntity, (place) => place.image)
  place!: PlaceEntity;
}
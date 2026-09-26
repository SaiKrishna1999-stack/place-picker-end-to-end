import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import { ImageEntity } from './image-entity';

@Entity('places')
export class PlaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;
  
  @Column('numeric', { precision: 9, scale: 6 })
  latitude!: number;

  @Column('numeric', { precision: 9, scale: 6 })
  longitude!: number;
  
  @Column()
  isFavorite!: boolean;

  @OneToOne(() => ImageEntity, (image) => image.place, { cascade: true })
  @JoinColumn()
  image!: ImageEntity;

}
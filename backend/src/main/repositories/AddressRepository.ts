import debug from 'debug';
import { injectable } from 'tsyringe';
import { AddressCreationDTO, AddressUpdateDTO } from '../dto/AddressDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:AddressRepository');
import { Address } from '../models/Address';

@injectable()
export default class AddressRepository implements CRUD {
    constructor() {
        log('Created new instance of AddressRepository');
    }

    public create = async (addressInfo: AddressCreationDTO): Promise<[Address, boolean]> => {
        try {
            const createdAddress = await Address.findOrCreate({
                where: {
                    civicNumber: addressInfo.civicNumber,
                    streetName: addressInfo.streetName,
                    postalCode: addressInfo.postalCode,
                    cityName: addressInfo.cityName,
                    province: addressInfo.province,
                    country: addressInfo.country
                },
                defaults: {
                    addressInfo
                }
            });

            if (createdAddress[1] === true) {
                log(`Added new address id ${createdAddress[0].id}`);
            } else {
                log(`Found address id ${createdAddress[0].id}`);
            }

            return Promise.resolve(createdAddress);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public delete = async (id: number): Promise<number> => {
        try {
            const deletedAddressStatus = await Address.destroy({
                where: {
                    id: id
                }
            });

            log(`Address with id ${id} has been deleted`);
            return Promise.resolve(deletedAddressStatus);
        } catch (err: any) {
            log(err);
            return Promise.resolve(err);
        }
    };

    public update = async (id: number, updatedValue: AddressUpdateDTO): Promise<number> => {
        try {
            await Address.update(updatedValue, {
                where: {
                    id: id
                }
            });

            log(`Address with id ${id} has been updated`);
            return Promise.resolve(1);
        } catch (err: any) {
            return Promise.reject(err);
        }
    };

    public get = async (id: number): Promise<Address | null> => {
        try {
            const address = await Address.findByPk(id);

            log(`Address with id ${address?.id} has been retrieved`);
            return Promise.resolve(address);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public getAll = async (): Promise<Address[]> => {
        try {
            const addresses = await Address.findAll();

            log(`Retrieved all addresss`);
            return Promise.resolve(addresses);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };
}
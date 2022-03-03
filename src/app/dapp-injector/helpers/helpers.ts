import { ethers} from 'ethers'

export const  convertEtherToWei = (ether_value:number)=> {
  return (ether_value * 10 ** 18).toFixed(0);
}

export const  convertWeiToEther = (wei_value:number) => {
  return wei_value / 10 ** 18;
}

export const convertUSDtoEther = (usd_value:number,dollarExchange:number)=> {
  return usd_value / dollarExchange;
}

export const  convertEthertoUSD = (ether_value:number,dollarExchange:number) => {
  return ether_value * dollarExchange;
}

export const displayEther = (etherBalance:number)=> {
  return etherBalance.toString().substring(0, 6)
}

export const displayUsd = (usdBalance:any)=> {
  return usdBalance.toFixed(0, 2)
}

export const randomString = (length:number): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const alphabet_length = alphabet.length - 1;
  let password = "";
  for (let i = 0; i < length; i++) {
    const random_number = Math.floor(Math.random() * alphabet_length) + 1;
    password += alphabet[random_number];
  }
  return password
}
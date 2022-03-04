export interface IGRATITUDE_IPFS_JSON {
    type: NFT_TYPE,
    description:string,
    senderName:string,
    ipfsFileUrl?:string // Needed in case grattude nft not only text

}

export interface IGRATITUDE_NFT extends IGRATITUDE_IPFS_JSON {
    status:number,
    tokenId:number
}


export type NFT_TYPE = 'story' | 'audio' | 'image' | 'only-text'
// by story I mean a video less 20 sec
import * as jspb from 'google-protobuf'



export class vidMetaData extends jspb.Message {
  getVidinput(): string;
  setVidinput(value: string): vidMetaData;

  getVidoutput(): string;
  setVidoutput(value: string): vidMetaData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): vidMetaData.AsObject;
  static toObject(includeInstance: boolean, msg: vidMetaData): vidMetaData.AsObject;
  static serializeBinaryToWriter(message: vidMetaData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): vidMetaData;
  static deserializeBinaryFromReader(message: vidMetaData, reader: jspb.BinaryReader): vidMetaData;
}

export namespace vidMetaData {
  export type AsObject = {
    vidinput: string,
    vidoutput: string,
  }
}

export class tcStatus extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): tcStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): tcStatus.AsObject;
  static toObject(includeInstance: boolean, msg: tcStatus): tcStatus.AsObject;
  static serializeBinaryToWriter(message: tcStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): tcStatus;
  static deserializeBinaryFromReader(message: tcStatus, reader: jspb.BinaryReader): tcStatus;
}

export namespace tcStatus {
  export type AsObject = {
    status: string,
  }
}


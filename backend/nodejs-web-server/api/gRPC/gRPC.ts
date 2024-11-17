import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PackageDefinition } from '@grpc/proto-loader';

const gRPC_Client = async (vidPath : string, outPath : string) => {
    const packageDefinition = protoLoader.loadSync('/nodejs-web-server/api/gRPC/proto/tcServiceProtocol.proto', { // ./proto/tcServiceProtocol.proto
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }) as PackageDefinition;

    const protoDescripter = (grpc.loadPackageDefinition(packageDefinition) as unknown) as any

    const tcService = protoDescripter.transcode.tcReq
    
    const client = new tcService('go-mts:50051', grpc.credentials.createInsecure());
    
    const request = { vidInput : vidPath, vidOutput : outPath };
    
    client.transcodeVideo(request, {}, (err : grpc.ServiceError, response: any | null) => {
        if (err) { console.error('Error:', err.message); }
        else if (response) { console.log('Transcode Status:', response.status); } // return response.status; }
    });
}

export default gRPC_Client;

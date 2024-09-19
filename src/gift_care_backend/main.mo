import Int "mo:base/Int";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
actor {
    type DonationRequest = {
        id: Nat;
        name: Text;
        contactDetails: Text;
        description: Text;
        proofUrl: Text;
        timestamp: Int;
        status: Text; 
    };

stable var requests: [DonationRequest] = [];

public func submitRequest(name: Text, contactDetails: Text, description: Text, proofUrl: Text) : async Nat {
    let id = Int.abs(Array.size(requests)); 
    let newRequest: DonationRequest = {
        id = id;
        name = name;
        contactDetails = contactDetails;
        description = description;
        proofUrl = proofUrl;
        timestamp = Time.now();
        status = "Pending";
    };
    requests := Array.append<DonationRequest>(requests, [newRequest]); 
    Debug.print(debug_show(requests));
    return id;
};

public query func getRequests() : async [DonationRequest] {
    return requests;
};

};

import Int "mo:base/Int";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

actor {
    type DonationRequest = {
        id: Nat;
        name: Text;
        contactDetails: Text;
        description: Text;
        proofUrl: Text;
        timestamp: Int;
        status: Text;
        principal: Principal; 
    };

    stable var requests: [DonationRequest] = [];

    public func submitRequest(
        userPrincipal: Principal, 
        name: Text,
        contactDetails: Text,
        description: Text,
        proofUrl: Text
    ) : async Nat {
        let id = Int.abs(Array.size(requests));  
        let newRequest: DonationRequest = {
            id = id;
            name = name;
            contactDetails = contactDetails;
            description = description;
            proofUrl = proofUrl;
            timestamp = Time.now();
            status = "Pending";
            principal = userPrincipal;  
        };
        requests := Array.append<DonationRequest>(requests, [newRequest]); 
        return id;
    };

    public query func getRequestsByUser(userPrincipal: Principal) : async [DonationRequest] {
        return Array.filter<DonationRequest>(requests, func (request: DonationRequest) : Bool {
            request.principal == userPrincipal;  
        });
    };

    public query func getRequests() : async [DonationRequest] {
        return requests;
    };
};

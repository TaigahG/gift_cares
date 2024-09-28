import Int "mo:base/Int";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

actor {
    type Votes = {
        layak: Nat;
        tidakLayak: Nat;
    };

    type DonationRequest = {
        id: Nat;
        title: Text;
        name: Text;
        contactDetails: Text;
        description: Text;
        proofUrl: Text;
        timestamp: Int;
        status: Text;
        principal: Principal;
        votes: Votes;  
    };

    stable var requests: [DonationRequest] = [];

    public func submitRequest(
        userPrincipal: Principal,
        title: Text,
        name: Text,
        contactDetails: Text,
        description: Text,
        proofUrl: Text
    ) : async Nat {
        let id = Int.abs(Array.size(requests));  
        let newRequest: DonationRequest = {
            id = id;
            title = title;
            name = name;
            contactDetails = contactDetails;
            description = description;
            proofUrl = proofUrl;
            timestamp = Time.now();
            status = "Pending";
            principal = userPrincipal;
            votes = { layak = 0; tidakLayak = 0 };  
        };
        requests := Array.append(requests, [newRequest]); 
        return id;
    };

    public query func getRequestsByUser(userPrincipal: Principal) : async [DonationRequest] {
        return Array.filter(requests, func (request: DonationRequest) : Bool {
            request.principal == userPrincipal;  
        });
    };

    public query func getRequestsById(id: Nat) : async ?DonationRequest {
        return Array.find(requests, func (request: DonationRequest) : Bool {
            request.id == id;
        });
    };

    public query func getRequests() : async [DonationRequest] {
        return requests;
    };

    public func voteRequest(id: Nat, vote: Text) : async () {
        let requestOpt = Array.find(requests, func (r: DonationRequest) : Bool {
            r.id == id;
        });

        switch (requestOpt) {
            case (?request) {
                let updatedRequest = request;
                let updatedVotes = if (vote == "layak") {
                    { layak = updatedRequest.votes.layak + 1; tidakLayak = updatedRequest.votes.tidakLayak }
                } else if (vote == "tidak layak") {
                    { layak = updatedRequest.votes.layak; tidakLayak = updatedRequest.votes.tidakLayak + 1 }
                } else {
                    updatedRequest.votes  
                };

                requests := Array.map(requests, func (r: DonationRequest) : DonationRequest {
                    if (r.id == id) {
                        return { r with votes = updatedVotes }; 
                    } else {
                        return r; 
                    }
                });
            };
            case (_) { return; }; 
        };
    };
};

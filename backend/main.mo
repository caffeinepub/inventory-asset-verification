import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";

actor {
  type Location = {
    locationId : Text;
    name : Text;
    address : Text;
    description : Text;
  };

  type GPSCoordinates = {
    latitude : Float;
    longitude : Float;
  };

  type AssetStatus = {
    condition : Text;
    remarks : Text;
    lastVerified : Int;
    verifiedBy : Text;
    gpsCoordinates : GPSCoordinates;
    photos : [Text];
  };

  type Asset = {
    assetId : Text;
    name : Text;
    category : Text;
    locationId : Text;
    condition : Text;
    remarks : Text;
    gpsCoordinates : GPSCoordinates;
    timestamp : Int;
    photos : [Text];
  };

  type DeleteResult = {
    #success;
    #assetNotFound;
  };

  let assets = Map.empty<Text, Asset>();

  public shared ({ caller }) func submitAssetCheck(assetId : Text, name : Text, category : Text, locationId : Text, condition : Text, remarks : Text, latitude : Float, longitude : Float, photos : [Text]) : async () {
    let gpsCoordinates : GPSCoordinates = {
      latitude;
      longitude;
    };

    let asset : Asset = {
      assetId;
      name;
      category;
      locationId;
      condition;
      remarks;
      gpsCoordinates;
      timestamp = Time.now();
      photos;
    };

    assets.add(assetId, asset);
  };

  public shared ({ caller }) func updateAssetStatus(assetId : Text, condition : Text, remarks : Text, latitude : Float, longitude : Float, photos : [Text]) : async () {
    let asset = switch (assets.get(assetId)) {
      case (null) { Runtime.trap("Asset not found") };
      case (?a) { a };
    };

    let updatedGPS : GPSCoordinates = {
      latitude;
      longitude;
    };

    let updatedAsset = {
      asset with
      condition;
      remarks;
      gpsCoordinates = updatedGPS;
      timestamp = Time.now();
      photos;
    };

    assets.add(assetId, updatedAsset);
  };

  public shared ({ caller }) func deleteAsset(assetId : Text) : async DeleteResult {
    switch (assets.get(assetId)) {
      case (null) { #assetNotFound };
      case (_) {
        assets.remove(assetId);
        #success;
      };
    };
  };

  public query ({ caller }) func getAllAssets() : async [Asset] {
    assets.toArray().map(func((_, asset)) { asset });
  };

  module Asset {
    public func compare(a : Asset, b : Asset) : Order.Order {
      Text.compare(a.assetId, b.assetId);
    };
  };

  public query ({ caller }) func getAssetsByLocation(locationId : Text) : async [Asset] {
    assets.values().toArray().filter(func(asset) { asset.locationId == locationId }).sort();
  };

  public query ({ caller }) func findAssetsByName(name : Text) : async [Asset] {
    assets.values().toArray().filter(func(asset) { asset.name.contains(#text name) });
  };

  public query ({ caller }) func getAssetCountsByCategory() : async [(Text, Nat)] {
    let countsMap = Map.empty<Text, Nat>();

    for (asset in assets.values()) {
      let currentCount = switch (countsMap.get(asset.category)) {
        case (null) { 0 };
        case (?count) { count };
      };
      countsMap.add(asset.category, currentCount + 1);
    };

    countsMap.toArray();
  };

  public query ({ caller }) func getLocationCountsByCondition() : async [(Text, [(Text, Nat)])] {
    let locationsMap = Map.empty<Text, Map.Map<Text, Nat>>();

    for (asset in assets.values()) {
      let locationMap = switch (locationsMap.get(asset.locationId)) {
        case (null) { Map.empty<Text, Nat>() };
        case (?map) { map };
      };
      let currentCount = switch (locationMap.get(asset.condition)) {
        case (null) { 0 };
        case (?count) { count };
      };
      locationMap.add(asset.condition, currentCount + 1);
      locationsMap.add(asset.locationId, locationMap);
    };

    locationsMap.toArray().map(
      func((locationId, conditionMap)) {
        (locationId, conditionMap.toArray());
      }
    );
  };

  public query ({ caller }) func exportAssetVerifications() : async [Asset] {
    assets.values().toArray();
  };
};

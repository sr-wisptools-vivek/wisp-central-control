subsManager = new SubsManager();

WtCollection = function(collectionName, settings) {

  // Create new collection
  var wtCollection = new Mongo.Collection(collectionName);

  // Set basic permissions
  // TODO: Add better access control (The owner control might be enough)
  wtCollection.allow({
    insert: function(userId, doc) {
      if (settings && settings.update && settings.insert.requireLogin === false) {
        return true;
      }
      return !! userId;
    },
    update: function(userId, doc) {
      if (settings && settings.update && settings.update.requireLogin === false) {
        return true;
      }
      return !! userId;
    }
  });

  var requirePagination = false;
  if (settings && settings.requirePagination) {
    requirePagination = true;
  }

  if (Meteor.isServer) {
    Meteor.publish(collectionName, function(limit, query, sort) {
      if (!this.userId) return null;

      if (typeof (limit) === 'undefined' || isNaN(limit)) {
        limit = 0;
      }

      if (typeof (query) === 'undefined') {
        query = {};
      }

      if (typeof (sort) === 'undefined') {
        sort = false;
      }

      // TODO: When publishing md_archive, should suppress the file list, as it can be long.

      // Only publish all to admins
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        if (requirePagination) {
          var options = {limit: limit};
          if (sort) {
            options.sort = sort;
          }
          return wtCollection.find(query, options);
        } else {
          return wtCollection.find();
        }
      } else if (settings && settings.read && settings.read.roles && Roles.userIsInRole(this.userId, settings.read.roles)) {
        if (requirePagination) {
          var options = {limit: limit};
          if (sort) {
            options.sort = sort;
          }
          return wtCollection.find(query, options);
        } else {
          return wtCollection.find();
        }
      } else {
        if (requirePagination) {
          var options = {limit: limit};
          if (sort) {
            options.sort = sort;
          }
          query.owner = this.userId;
          return wtCollection.find(query, options);
        } else {
          return wtCollection.find({owner: this.userId});
        }
      }

    });

    wtCollection.before.insert(function(userId, doc) {
      // Created date
      doc.createdAt = new Date();
      // document creator and owner
      doc.creator = userId;
      doc.owner = userId;
    });

    wtCollection.before.update(function(userId, doc, fieldNames, modifier, options) {
      var hasUpdatePermission = false;
      if (settings && settings.update && settings.update.requireLogin === false) {
        hasUpdatePermission = true;
      } else {
        if (Roles.userIsInRole(userId, ['admin'])) {
          hasUpdatePermission = true;
        }
        // Check if the user owns this doc
        if (!hasUpdatePermission && doc.owner == userId) {
          hasUpdatePermission = true;
        }
        if (!hasUpdatePermission && settings && settings.update && settings.update.roles && Roles.userIsInRole(userId, settings.update.roles)) {
          if (settings.update.fields && settings.update.fields==='all') {
            hasUpdatePermission = true;
          } else if (settings.update.fields && typeof(settings.update.fields)==='object') {
            hasUpdatePermission = true;
            for (var i=0; i<fieldNames.length; i++) {
              if (settings.update.fields.indexOf(fieldNames[i])===-1) {
                hasUpdatePermission = false;
                break;
              }
            }
          }
        }
      }
      if (!hasUpdatePermission) {
        throw new Meteor.Error(403, "Access denied");
      }
      // Updated date
      modifier.$set = modifier.$set || {};
      modifier.$set.updatedAt = new Date();
    });
  }

  if (Meteor.isClient) {
    if (requirePagination) {
      var lastSubscriptionHandle = new Array();
      wtCollection.subscribe = function (query, forceClear, sort, forceLimit) {
        var limitSize = 15;
        if (forceLimit !== 'undefined' && !isNaN(forceLimit)) {
          limitSize = forceLimit;
        }
        Session.set('wtCollectionLoading', true);
        if (typeof (query) === 'undefined') {
          query = {};
        }
        if (typeof (sort) === 'undefined') {
          sort = {};
        }
        if (typeof (forceClear) === 'undefined') {
          forceClear = false;
        }
        if (!Session.get('wtCollectionLimit')) {
          Session.set('wtCollectionLimit', limitSize);
        }
        var limit = Session.get('wtCollectionLimit');
        if (isNaN(limit)) {
          limit = limitSize;
        }
        if (Session.get('wtCollectionLastCollection') != collectionName || forceClear) {
          //Reset limit and stop earlier subscriptions
          while (lastSubscriptionHandle.length > 0) {
            var subscriptionHandle = lastSubscriptionHandle.pop();
            if (typeof(subscriptionHandle) === 'object') {
              subscriptionHandle.stop();
            }
          }
          limit = limitSize;
        }
        Session.set('wtCollectionLimit', limit);
        Session.set('wtCollectionLastCollection', collectionName);
        var subscriptionHandle = Meteor.subscribe(collectionName, limit, query, sort, function () {
          var resultCount = wtCollection.find(query).count();
          Session.set('wtCollectionHasMoreRecords', false);
          if (resultCount >= limit) {
            Session.set('wtCollectionHasMoreRecords', true);
          }
          Session.set('wtCollectionLimit', resultCount + limitSize);
          Session.set('wtCollectionLoading', false);
        });
        lastSubscriptionHandle.push(subscriptionHandle);
      };
    } else {
      subsManager.subscribe(collectionName);
    }
  }

  return wtCollection;

};

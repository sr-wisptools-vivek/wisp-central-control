A WISP Tools Interaction is foundational to adding and modifying customers.  Example: a customer calls in and wants to change plans.  Rather than going to a customer page and changing the plan, you need to start a Customer Service Interaction.  From the interaction page, you modify the record, this way you are getting a generic logging of what is being done, as well as making changes to a customers plan.

Interactions are stored in the wt_interaction mongo collection.  The dropdown menu and templates used can be changed, by editing the wt_interaction_config collection.

Usage: add a call to the {{> wtInteractionDropdownMenu}} template where you want the menu to show up.
# Creating Maps

## Map Types

Map in Color supports two types of maps: **Choropleth** and **Categorical**. The system automatically detects the appropriate type based on your data, but you can manually switch between them at any time.

### Choropleth

Choropleth maps are used for numerical data. Examples:

- Internet usage (%)
- GDP per capita
- Population density
- Human Development Index (HDI)

In a choropleth map, each country is assigned a numerical value. Countries are then grouped into value ranges, and each range is displayed using a different shade or color.

#### Automatic Range Generation

Map in Color can automatically generate value ranges based on your dataset.

The system:

- Analyzes the distribution of your numeric values
- Determines an appropriate number of ranges
- Creates balanced or evenly spaced bins depending on the data
- Rounds boundaries to clean, human-readable numbers

This ensures that ranges reflect the structure of your data while remaining visually clear and easy to interpret.

If all values are identical, a single range is generated.

#### Manual Range Control

Users can add new ranges, remove ranges, edit lower and upper bounds manually, rename ranges, and adjust colors for each range. Countries are assigned to ranges based on their numerical value—if a value falls within a defined lower and upper bound, it will automatically appear in that range. By default, range labels are numeric (e.g., 0.1 – 0.5), but users can define custom range names.

#### Color Customization

For choropleth maps, users can choose a base color (which automatically generates a light-to-dark gradient), select from predefined Map in Color themes, or manually set custom colors for each range. The gradient system ensures that lower values appear lighter and higher values appear darker, creating a clear visual hierarchy.

### Categorical

Categorical maps are used for classification data. Examples:

- World Cup winners
- EU membership
- Driving side (left/right)
- Income level groups

Instead of numerical ranges, categorical maps assign countries to named groups.

![Example of a categorical map: FIFA World Cup winners](/assets/3-0/france-preview.png)

*Example of a categorical map: FIFA World Cup winners.*

#### Creating Categories

Users create categories by adding entries to the category table. Each category includes a custom name and a custom color. Countries can then be manually assigned to any category through the data sidebar.

#### Handling Unassigned Countries

Users can optionally create a category for unassigned countries. This is useful when only part of the dataset belongs to a defined group and the remaining countries should share a common classification (e.g., "Not Applicable" or "Never Won").

#### Visual Control

Each category has a fixed color. Unlike choropleth maps, categorical maps do not use gradients—they use distinct color blocks to represent discrete groups. This makes categorical maps ideal for binary or multi-group classifications.

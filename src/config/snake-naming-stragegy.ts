import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";

export class SnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  /**
   * Converts table name from entity class name
   * Example: ServiceRequestEntity -> service_request_entity
   */
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  /**
   * Converts column name from property name
   * Example: firstName -> first_namex
   */
  columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[],
  ): string {
    const nameWithPrefix = embeddedPrefixes.length
      ? embeddedPrefixes.join("_") + "_" + propertyName
      : propertyName;

    return customName ? customName : snakeCase(nameWithPrefix);
  }

  /**
   * Converts relation name
   * Example: userProfile -> user_profile
   */
  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  /**
   * Converts join column name (foreign key)
   * Example: userId -> user_id
   */
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + "_" + referencedColumnName);
  }

  /**
   * Converts join table name for many-to-many relationships
   * Example: user_roles
   */
  joinTableName(
    firstTableName: string,
    secondTableName: string,
    // firstPropertyName: string,
    // secondPropertyName: string,
  ): string {
    return snakeCase(firstTableName + "_" + secondTableName);
  }

  /**
   * Converts join table column names
   */
  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + "_" + (columnName ? columnName : propertyName),
    );
  }

  /**
   * Converts class property name to database column name for join table inverse side
   */
  joinTableInverseColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + "_" + (columnName ? columnName : propertyName),
    );
  }

  /**
   * Converts class table name to a class property name for join tables
   */
  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ): string {
    return snakeCase(parentTableName + "_" + parentTableIdPropertyName);
  }
}

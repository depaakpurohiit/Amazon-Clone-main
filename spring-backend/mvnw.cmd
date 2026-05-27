@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MVN_CMD=mvn.cmd") ELSE (SET "MVN_CMD=%__MVNW_ARG0_NAME__%")
@SET "MAVEN_PROJECTBASEDIR=%~dp0"
@SET "MAVEN_PROJECTBASEDIR_TRIM=%MAVEN_PROJECTBASEDIR:~0,-1%"

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET "JAVA_HOME_STR=C:\Program Files\Java\jdk-21"
@SET "PATH=%JAVA_HOME_STR%\bin;%PATH%"

@REM Some wrapper jars may not declare a Main-Class manifest, so invoke the launcher
@REM class explicitly via classpath (works for both cases).
"%JAVA_HOME_STR%\bin\java.exe" -Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR_TRIM% -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %*
